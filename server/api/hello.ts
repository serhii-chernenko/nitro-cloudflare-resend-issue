import { defineHandler } from "nitro/h3";
import { Resend } from 'resend'

export default defineHandler((event) => {
  const resend = new Resend('api_key')

  return { api: "works!"}
});
