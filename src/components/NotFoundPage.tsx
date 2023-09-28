import PageBase from './PageBase';

const NotFoundPage = () => (
  <PageBase title="404">
    <main class="h-full">
      <div class="flex h-full items-center justify-center text-center">
        <h1 class="text-6xl font-semibold">Сторінку не знайдено</h1>
      </div>
    </main>
  </PageBase>
);

export default NotFoundPage;
