---
title: How to Integrate Netlify Forms in a Saber app
date: 2019-09-12
layout: post
---

## Enter Netlify Forms

On [Netlify](https://www.netlify.com/products/forms/), any HTML form can instantly accept submissions—no backend code or infrastructure required. As soon as your form is deployed, you start seeing submissions appear in your Netlify dashboard.

## Forms in Saber

Getting started with using Netlify forms in a Saber app is as easy as including the relevant form and input tags into your Vue component.

For our example, let’s create a contact form. Here’s an abbreviated version of what a Netlify form looks like:

```vue
<client-only>
  <form name="contact" method="post" data-netlify="true">
    <input type="email" name="email" placeholder="Your email" />
    <textarea name="message" placeholder="Type something.."></textarea>
    <button type="submit">Submit</button>
  </form>
</client-only>
```

Note that [`<client-only>`](https://saber.land/docs/components#clientonly) is a built-in Vue component in Saber, we need to render this form on client-side only because otherwise Netlify will modify the `<form>` element in initial HTML which will cause [Client Side Hydration](https://ssr.vuejs.org/guide/hydration.html) to fail.

## Netlify bots, do you read?

Because what we did in the last step, Netlify can't find any forms at build time, so you need to explictly create a stand-in static form that Netlify can read at build time.

You can achieve this by adding a `netlify-forms.html` in `./static` folder:

```html
<form name="contact" data-netlify="true" hidden>
  <input type="email" name="email" />
  <textarea name="message"></textarea>
</form>
```

The `hidden` attribute on `<form>` element is optional, we just want to ensure that users won't see anything when they visit `/netlify-forms.html`.

## More

You can learn about [Spam Filtering](https://www.netlify.com/docs/form-handling/#spam-filtering) and more on [Netlify docs website](https://www.netlify.com/docs/form-handling).
