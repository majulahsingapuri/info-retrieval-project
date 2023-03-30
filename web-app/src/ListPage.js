import Post from "./Post"

const ListPage = ({ searchResults }) => {

    const results = searchResults.map(post => <Post key={post.id} post={post} />)
// if no results, return no matching posts else return the content
    const content = results?.length ? results : <article><p>No Matching Posts</p></article>

    return (
        <main>{content}</main>
    )
}
export default ListPage