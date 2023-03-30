// for every post it receives, has 3 elements of an article 

const Post = ({ post }) => {
    return (
        <article>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>Post ID: {post.id}</p>
        </article>
    )
}
export default Post