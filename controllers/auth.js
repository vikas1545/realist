import * as config from "../config.js";

export const welcome = (req, res) => {
    res.json({
        data: "Hello Vikas",
    });
};

export const preRegister = async (req, res) => {
    try {
        console.log(req.body);

        const emailParams = {
            Source: config.EMAIL_FROM,
            Destination: {
                ToAddresses: [config.EMAIL_TO],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<h1>Welcome to Realist App</h1>`,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Welcome to Realist",
                },
            },
        };

        const data = await config.AWSSES.sendEmail(emailParams).promise();

        console.log('Email data:', data);
        return res.json({ ok: true });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Something went wrong. Try again.' });
    }
};
