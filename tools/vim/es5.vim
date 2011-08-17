"------------------------------------------------------------------------------
" Vim syntax file
" Language:     ECMAScript 5 (+ JSLint eventually)
" Maintainer:   Sean Wilkinson <sean@mathbiol.org>
" URL:          http://web-chassis.googlecode.com
" Last Change:  16-Aug-2011.
" Filenames:    *.js
" Version:      0.1
"------------------------------------------------------------------------------

" TODO:
" - Finish the rest of the ``basic'' syntax ;-)
" - Add an error for a trailing comma in a JSON literal.
" - Add an error for leading or trailing underscores in identifier names.
" - Find out if 'Hello\0world!' should print as 'Hello' or as 'Hello world!'.

" For version 5.x: Clear all syntax items
" For version 6.x: Quit when a syntax file was already loaded

" Quit when a (custom) syntax file was already loaded
if exists("b:current_syntax")
  finish
endif

if !exists("main_syntax")
  if version < 600
    syntax clear
  endif
  let main_syntax = 'es5'
endif

" Drop fold if it set but vim doesn't support it.
if version < 600 && exists("es5_fold")
  unlet es5_fold
endif

syn case match

syn keyword es5BooleanLiteral   true false

syn keyword es5CommentTodo      FIXME NOTE TODO XXX contained

syn match   es5CommentStart     "/\*"
syn match   es5CommendEnd       "\*/" contained
syn match   es5CommentError     "\*/"
syn region  es5LineComment      start="//" end="$" contains=es5CommentTodo
syn region  es5Comment          start="/\*" end="\*/" keepend contains=es5LineComment,es5CommentTodo

syn keyword es5Keyword          break case catch continue debugger default delete do else finally for function if in instanceof new return switch this throw try typeof var void while with

syn keyword es5NumericConstants Infinity NaN

syn keyword es5ReservedFuture   class const enum export extends import super
syn keyword es5ReservedStrict   implements interface let package private protected public static yield

syn match   es5StringBSError    "\\" contained 
syn match   es5StringBreak      "\\$" contained
syn match   es5StringEscaped    "\\[bfnrtv"'\\]" contained
syn match   es5StringHexCode    "\\x[0-9A-Fa-f][0-9A-Fa-f]" contained
syn match   es5StringUnicode    "\\u[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]" contained
syn region  es5StringDoubleQ    start=+"+ skip=+\\"+ end=+"+ keepend contains=es5StringEscaped,es5StringBreak,es5StringBSError,es5StringHexCode,es5StringUnicode
syn region  es5StringSingleQ    start=+'+ skip=+\\'+ end=+'+ keepend contains=es5StringEscaped,es5StringBreak,es5StringBSError,es5StringHexCode,es5StringUnicode

syn match   es5TypeConstructor  "\<[A-Z][_\$a-zA-Z0-9]*\>"

hi def link es5BooleanLiteral   Boolean
hi def link es5Comment          Comment
hi def link es5CommentStart     Comment
hi def link es5CommentEnd       Comment
hi def link es5CommentError     Error
hi def link es5CommentTodo      Todo
hi def link es5GlobalVariable   Error
hi def link es5Keyword          Statement
hi def link es5LineComment      Comment
hi def link es5NumericConstants Constant
hi def link es5ReservedFuture   Error
hi def link es5ReservedStrict   Error
hi def link es5StringBreak      Operator
hi def link es5StringBSError    Error
hi def link es5StringDoubleQ    String
hi def link es5StringEscaped    Special
hi def link es5StringHexCode    Special
hi def link es5StringSingleQ    String
hi def link es5StringUnicode    Special
hi def link es5TypeConstructor  TypeDef

let b:current_syntax = "es5"

if main_syntax == 'es5'
  unlet main_syntax
endif

" vim:set syntax=vim ts=8:
