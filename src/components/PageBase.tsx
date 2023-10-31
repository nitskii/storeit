/// <reference types="@kitajs/html/htmx.d.ts" />

import Html from '@kitajs/html';

const PageBase = ({ children }: Html.PropsWithChildren) => (
  <>
    {'<!DOCTYPE html>'}
    <html class="h-full bg-orange-50">
      <head>
        <meta hx-preserve="true" charset="UTF-8" />
        <meta hx-preserve="true" name="viewport" content="width=device-width, initial-scale=1.0" />
        <link hx-preserve="true" href="/public/favicon.ico" rel="icon" />
        <link hx-preserve="true" href="/public/tailwind.css" rel="stylesheet" />
        <script defer hx-preserve="true" src="/public/htmx.min.js" />
        <script defer hx-preserve="true" src="/public/base.js" />
        <script defer hx-preserve="true" src="https://unpkg.com/htmx.org/dist/ext/head-support.js" />
      </head>
      <body
        class="flex h-screen flex-col"
        hx-ext='head-support'>
        {children}
      </body>
    </html>
  </>
);

export default PageBase;
