import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

const SearchBar = ({ posts, setSearchResults }) => {
// Current app has no submit , button has no effect but code is included just for semantic effect
    const handleSubmit = (e) => e.preventDefault()

//not importing use effect and usestate
    const handleSearchChange = (e) => {
// if there is the searchbar is empty, return the entire list of posts ie. all 100
        if (!e.target.value) return setSearchResults(posts)
// or else, filter all the posts which title and body includes that in the search bar
        const resultsArray = posts.filter(post => post.title.includes(e.target.value) || post.body.includes(e.target.value))

        setSearchResults(resultsArray)
    }

    return (
        <header>
            <form className="search" onSubmit={handleSubmit}>
                <input
                    className="search__input"
                    type="text"
                    id="search"
                    onChange={handleSearchChange}
                />
                <button className="search__button">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </form>
        </header>
    )
}
export default SearchBar