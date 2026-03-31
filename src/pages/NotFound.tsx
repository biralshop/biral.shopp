import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-8xl font-bold text-primary/20">404</div>
        <h1 className="text-2xl font-bold mt-4">Səhifə tapılmadı</h1>
        <p className="text-muted-foreground mt-2">Axtardığınız səhifə mövcud deyil və ya köçürülüb.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/">
            <Button><Home className="h-4 w-4 mr-2" /> Ana səhifə</Button>
          </Link>
          <Link to="/axtaris">
            <Button variant="outline"><Search className="h-4 w-4 mr-2" /> Axtarış</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
