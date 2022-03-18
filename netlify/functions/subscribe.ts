import { Handler } from "@netlify/functions";
import axios, { AxiosResponse } from "axios";
import url from "url";

type AccessTokenResponse = {
  refresh_token_expires_in: string;
  api_product_list: string;
  api_product_list_json: string[];
  origanization_name: string;
  "developer.email": string;
  token_type: string;
  issued_at: string;
  client_id: string;
  access_token: string;
  application_name: string;
  scope: string;
  expires_in: string;
  refresh_count: string;
  status: string;
};

const getAccessToken = async () => {
  const params = new url.URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const response: AxiosResponse<AccessTokenResponse> = await axios.post(
    "https://arvesta-dev.apimanagement.hana.ondemand.com/v1/OAuthService/GenerateToken",
    params.toString()
  );

  return response.data.access_token;
};

export const handler: Handler = async (event) => {
  const { email } = JSON.parse(event.body);
  const website =
    event.path !== "/" ? event.rawUrl.split(event.path)[0] : event.rawUrl;

  try {
    const accessToken = await getAccessToken();
    console.log(
      "🚀 ~ file: subscribe.ts ~ line 55 ~ consthandler:Handler= ~ accessToken",
      accessToken
    );

    const body = `
        <?xml version="1.0" encoding="utf-8"?>
        <MarketingPermissionUpdateRequest>
            <email>${email}</email>
            <enabled>true</enabled>
            <website>${website}</website>
            <country>BE</country>
            <language>NL</language>
        </MarketingPermissionUpdateRequest>
    `;

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/xml",
      },
      data: body,
    };

    const response = await axios.post(
      "https://arvesta-dev.apimanagement.hana.ondemand.com:443/cpi/v1/contentful",
      config
    );
    console.log(
      "🚀 ~ file: subscribe.ts ~ line 79 ~ consthandler:Handler= ~ response",
      response
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: submission-created.ts ~ line 29 ~ consthandler:Handler= ~ error",
      error.response.data
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello! ${email}`,
    }),
  };
};
