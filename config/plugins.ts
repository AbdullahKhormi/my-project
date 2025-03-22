module.exports = {
  email: {
    provider: 'mailgun',
    providerOptions: {
      apiKey: '3d4b3a2a-bec00853', // API Key الخاص بك
      domain: 'sandbox35dbffc3835b4c578b21c7db126a96f3.mailgun.org', // النطاق الخاص بك
    },
    settings: {
      defaultFrom: 'abady112009@gmail.com', // البريد الإلكتروني الافتراضي الذي سيتم إرسال الرسائل منه
      defaultReplyTo: 'abady112009@gmail.com', // البريد الإلكتروني الذي سيتم الرد عليه
    },
  },
};
