import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

(async function generateEnvFile() {
  console.log("Welcome to .env config");
  console.log('Please enter the following information:');
  
  // Pose des questions à l'utilisateur
  const answers = await inquirer.prompt([
    {
      name: 'NEXT_PUBLIC_SNCF_API_KEY',
      type: 'input',
      message: 'SNCF API KEY (you can ask for it here : https://numerique.sncf.com/startup/api/) :',
      validate: input => input ? true : 'Required',
    },
    {
      name: 'NEXT_PUBLIC_FIREBASE_API_KEY',
      type: 'input',
      message: 'Firebase API KEY :',
      validate: input => input ? true : 'Required',
    },
    {
      name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      type: 'input',
      message: 'Firebase AUTH DOMAIN :',
      validate: input => input ? true : 'Required',
    },
    {
      name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      type: 'input',
      message: 'Firebase PROJECT ID :',
      validate: input => input ? true : 'Required',
    },
    {
      name: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      type: 'input',
      message: 'Firebase STORAGE BUCKET :',
      validate: input => input ? true : 'Required',
    },
    {
      name: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      type: 'input',
      message: 'Firebase MESSAGING SENDER ID :',
      validate: input => input ? true : 'Required',
    },
    {
      name: 'NEXT_PUBLIC_FIREBASE_APP_ID',
      type: 'input',
      message: 'Firebase APP ID :',
      validate: input => input ? true : 'Required',
    },
    {
      name: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
      type: 'input',
      message: 'Firebase MEASUREMENT ID :',
      validate: input => input ? true : 'Required',
    },
    {
      name: 'NEXT_PUBLIC_FIREBASE_DATABASE_URL',
      type: 'input',
      message: 'Firebase DATABASE URL :',
      validate: input => input ? true : 'Required',
    },
  ]);

  // Crée le contenu du fichier .env
  const envContent = Object.entries(answers)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Définir le chemin du fichier .env
  const envPath = path.join(process.cwd(), '.env.local');

  // Écrit ou remplace le fichier .env
  fs.writeFileSync(envPath, envContent);

  console.log(`✅ .env file generated successfully : ${envPath}`);
})();
