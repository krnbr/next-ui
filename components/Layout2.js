import Header from './Header';

const layoutStyle = {
    margin: 20,
    padding: 20,
    border: '1px solid #DDD'
};

const Layout = props => (
    <div style={layoutStyle}>
        <Header />
        {console.log("opened")}
        {console.log("opened ->")}
        {props.content}
    </div>
);

export default Layout;
