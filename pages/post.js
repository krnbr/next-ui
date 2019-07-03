import { withRouter } from 'next/router';
import Layout from '../components/MyLayout.js';

const Content = withRouter(props => (
    <div>
        {
            console.log('query --> '+props.router.query.title)
        }
        <h1>{props.router.query.title}</h1>
        <p>This is the blog post content.</p>
    </div>
));

const Page = props => (
    <Layout>
        <Content />
    </Layout>
);

export default Page;
