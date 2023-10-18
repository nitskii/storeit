import PageBase from './PageBase';

const NotFoundPage = () => (
  <PageBase>
    <head>
      <title>404</title>
    </head>
    <main class="h-full">
      <div class="flex h-full items-center justify-center text-center">
        <h1 class="text-6xl">Сторінку не знайдено</h1>
      </div>
    </main>
  </PageBase>
);

export default NotFoundPage;
