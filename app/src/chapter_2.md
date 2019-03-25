<!---
{"next": "chapter_3.md","title": "Usage"}
-->

# Using Gutenberg

The easiest way to use Gutenberg is to fork this repo.

Once you have forked this repo, update the `book.toml` file found in `app/src`.

```toml
[book]
authors = ["YOUR_NAME"]
multilingual = false
src = "src"
title = "YOUR_BOOK_TITLE"
```

This will set the proper author and book title values. Please note that currently at least, `src` and `multilingual` are not yet parameterized. 

Then, using makefile run:

```bash
$ make local
```

You only need to do this once and it will install rust / cargo / mdbook for you. Note this process usually takes a good 20-30 minutes to build!

To edit / add / remove content run:

```bash
$ make local_watch
```

from the root project directory. This runs a nodejs script that will watch the `src` folder in `app/src` for file changes and automatically regenerate the `SUMMARY.md` on change.

Each `.md` file that is added (currently only a flat file structure is supported) will regenerate `SUMMARY.md`. We use "metadata" on top of each content file in the following format:

```json
{"next": "chapter_2.md","title": "Gutenberg!","first":true}
```

to point to the next file and include special fields such as `title` and `first`. This JSON meta data header is wrapped in standard HTML comment tags (look at `app/src/chapter_1.md` for example).

This usage pattern - inspired by linkedlist insertions - is neat in particular because it ensures that inserting pages is seamless and quick (just swap two pointers vs N - 1 pointers).

The built HTML will be available locally in: `app/book/index.html`


