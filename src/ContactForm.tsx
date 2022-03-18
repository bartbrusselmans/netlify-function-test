import axios from "axios";
import React, { FormEvent } from "react";

const ContactForm = (): JSX.Element => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = { email: "test@123.be" };

    axios
      .post("/api/subscribe", data)
      .then((response) => {
        console.log(
          "🚀 ~ file: ContactForm.tsx ~ line 9 ~ axios.post ~ response",
          response
        );
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: ContactForm.tsx ~ line 11 ~ axios.post ~ error",
          error
        );
      });
  };

  return (
    <form onSubmit={handleSubmit} name="contact-form" method="post">
      <input type="hidden" name="form-name" value="contact-form" />
      <div>
        <label htmlFor="email">E-mail</label> <br />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="doe@example.com"
          required
        />
      </div>
      <div>
        <input type="submit" className="submit" value="Send Message" />
      </div>
    </form>
  );
};

export default ContactForm;
