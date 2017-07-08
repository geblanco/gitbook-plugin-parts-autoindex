Gitbook Plugin Parts Auto Index
=============
A gitbook plugin prepend the index level (from summary) into every h1, h2, ..., title

### Install

Add this to your `book.json`, then run `gitbook install`:

```json
{
    "plugins": ["parts-autoindex"]
}
```

### Setup

In your `book.json` add

```json
{
	"pluginsConfig": {
		"parts-autoindex": {
			"level": 2,
			"trim": 1
		}
	}
}
```

Where:

* `level`: [optional, default: 3]. The number until which to prepend the level number eg: 1 = only to h1, 2 = h1, h2, 3 = h1, h2, h3, ...
* `trim`: [optional, default: 0]. The amount on numbers to trim from the left from the summary level numbers, eg: 2.3.6 (trim=1) -> 3.6, useful when not using parts
