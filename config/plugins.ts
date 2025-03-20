export default ({ env }: { env: (key: string) => string }) => ({
  email: {
    provider: 'smtp',
    providerOptions: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // Use false for TLS
      auth: {
        user: env('akhormi.1@outlook.com'), // your Outlook email
        pass: env('Ab11223344@@'), // your Outlook password or app-specific password if 2FA is enabled
      },
    },
    settings: {
      defaultFrom: 'akhormi.1@outlook.com', // Your Outlook email
      defaultReplyTo: 'akhormi.1@outlook.com',
    },
  },
});
