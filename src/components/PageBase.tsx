/// <reference types="@kitajs/html/htmx.d.ts" />

import Html from '@kitajs/html';

const PageBase = ({ children }: Html.PropsWithChildren) => (
  <>
    {'<!DOCTYPE html>'}
    <html class="h-full bg-orange-50">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/public/favicon.ico" rel="icon" />
        <link href="/public/tailwind.css" rel="stylesheet" />
      </head>
      <body class="flex h-screen flex-col">{children}</body>
      <script src="/public/htmx.min.js" />
      <script src="/public/main.js" />
    </html>
  </>
);

export default PageBase;
