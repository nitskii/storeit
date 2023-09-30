import Html from '@kitajs/html';

const PageBase = ({ title, children }: Html.PropsWithChildren<{ title: string }>) => (
  <>
    {'<!DOCTYPE html>'}
    <html class="h-full bg-orange-50">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/public/favicon.ico" rel="icon" />
        <link href="/public/tailwind.css" rel="stylesheet" />
        <title>{title}</title>
        <script defer src="/public/htmx.min.js" />
        <script defer src="/public/main.js" />
      </head>
      <body class="h-full">
        {children}
      </body>
    </html>
  </>
);

export default PageBase;
