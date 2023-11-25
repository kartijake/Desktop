import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import * as fs from 'fs/promises';
import bcrypt from "bcryptjs"
import * as crypto from 'crypto';
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

const userDataFile = path.join(app.getPath('documents'), 'userData.json');
const secretKey = 'efbc9f5a16f0161bfe7623a0897d38631edc71f12f9862a656435cce6865bcb0'
const iv = Buffer.from('default-iv-hex-string', 'hex');

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
    minHeight:480,
    minWidth:720,

  })
  win.setTitle("Travel Log")
  
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
ipcMain.on('submit:auth', async (event, args) => {
  console.log("init")
  if (args.type === 'sign-up') {
    try {
      // Read existing user data
      const userData = await readUserData();

      // Check if the email already exists
      const existingUser = userData.find((user:any) => user.email === args.email);
      if (existingUser) {
        event.reply('submit:auth:response', { type: 'sign-up', success: false, error: 'Email already exists' });
        return;
      }

      // Generate a salt
      const salt = await bcrypt.genSalt(10);

      // Hash the password using the generated salt
      const hashedPassword = await bcrypt.hash(args.password, salt);

      // Add the new user data
      userData.push({
        name: args.name,
        email: args.email,
        password: hashedPassword,
        "userLogs":{
          "1":"",
          "2":"",
          "3":"",
          "4":"",
          "5":"",
          "6":""
        }
      });

      // Write the updated user data back to the file
      await writeUserData(userData);

      // Send a success response back to the renderer process
      event.reply('submit:auth:response', { type: 'sign-up', success: true });
    } catch (error) {
      // Handle errors appropriately
      console.error('Error processing sign-up:', error);

      // Send an error response back to the renderer process
      event.reply('submit:auth:response', { type: 'sign-up', success: false, error: error });
    }
  } else if (args.type === 'login') {
    try {
      // Read existing user data
      const userData = await readUserData();

      // Find the user with the provided email
      const loginUser = userData.find((user:any) => user.email === args.email);

      if (!loginUser) {
        // User not found
        event.reply('submit:auth:response', { type: 'login', success: false, error: 'User not found' });
        return;
      }

      // Check the password
      const passwordMatch = await bcrypt.compare(args.password, loginUser.password);

      if (passwordMatch) {
        // Passwords match, send success response
        event.reply('submit:auth:response', { type: 'login', success: true,userData:{email:loginUser.email, name:loginUser.name} });
      } else {
        // Passwords do not match
        event.reply('submit:auth:response', { type: 'login', success: false, error: 'Incorrect password' });
      }
    } catch (error) {
      // Handle errors appropriately
      console.error('Error processing login:', error);

      // Send an error response back to the renderer process
      event.reply('submit:auth:response', { type: 'login', success: false, error: 'Error processing login' });
    }
  }
});

async function readUserData() {
  try {
    const data = await fs.readFile(userDataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or there is an error reading it, return an empty array
    return [];
  }
}

// Function to write user data to the file
async function writeUserData(data:any) {
  await fs.writeFile(userDataFile, JSON.stringify(data, null, 2), 'utf-8');
}


ipcMain.on('store:eventData', async (event, { email, eventId, summary }) => {
  try {
    // Read existing user data
    const userData = await readUserData();

    // Find the user with the provided email
    const userIndex = userData.findIndex((user:any) => user.email === email);

    if (userIndex !== -1) {
      // If the user exists, update the userLogs array with the new summary
      console.log(encrypt(summary))
      userData[userIndex].userLogs[eventId.toString()] = encrypt(summary);

      // Write the updated user data back to the file
      await writeUserData(userData);

      // Send a success response back to the renderer process
      event.reply('store:eventData:response', { success: true });
    } else {
      // If the user doesn't exist, send an error response
      event.reply('store:eventData:response', { success: false, error: 'User not found' });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error('Error storing eventData:', error);

    // Send an error response back to the renderer process
    event.reply('store:eventData:response', { success: false, error: 'Error storing eventData' });
  }
});


function encrypt(text: string): { ciphertext: Buffer, tag: Buffer, iv: Buffer } {
 // Initialization Vector
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey,"hex"), iv);

  const encryptedBuffer = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return { ciphertext: encryptedBuffer, tag, iv };
}

function decrypt(encrypted: {
  ciphertext: { type: string; data: number[] };
  tag: { type: string; data: number[] };
  iv: { type: string; data: number[] };
}): string | null {
  try {
    const ivBuffer = Buffer.from(encrypted.iv.data);
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secretKey, 'hex'), ivBuffer);
    decipher.setAuthTag(Buffer.from(encrypted.tag.data));

    const encryptedData = Buffer.from(encrypted.ciphertext.data);
    const decryptedBuffer = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    return decryptedBuffer.toString('utf-8');
  } catch (error) {
    console.error('Error decrypting:', error);
    return null;
  }
}



ipcMain.on('get:eventData', async (event, { email, eventId }) => {
  try {
    // Read existing user data
    const userData = await readUserData();

    // Find the user with the provided email
    const user = userData.find((u: any) => u.email === email);

    if (user) {
      console.log(user.userLogs[eventId.toString()])
      // Decrypt the specific eventData entry for the specified user and eventId
      const decryptedEventData = decrypt(user.userLogs[eventId.toString()] || '');

      // Send the decrypted eventData for the specified user and eventId back to the renderer process
      event.reply('get:eventData:response', { eventId, data: decryptedEventData });
    } else {
      // If the user doesn't exist, send an error response
      event.reply('get:eventData:response', { error: 'User not found' });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error('Error getting eventData:', error);

    // Send an error response back to the renderer process
    event.reply('get:eventData:response', { error: 'Error getting eventData' });
  }
});
