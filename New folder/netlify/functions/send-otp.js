import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { phone, otp } = JSON.parse(event.body);

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: phone
      })
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch (parseError) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          success: false,
          message: "Fast2SMS response was not valid JSON",
          raw: text
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "OTP sending failed",
        error: error.message
      })
    };
  }
}