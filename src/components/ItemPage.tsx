import ItemPageContent from './ItemPageContent';
import PageBase from './PageBase';

const ItemPage = ({ itemId }: { itemId: string }) => (
  <PageBase>
    <ItemPageContent itemId={itemId} />
  </PageBase>
);

export default ItemPage;
