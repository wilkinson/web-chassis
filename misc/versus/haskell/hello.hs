--  Haskell source code

--  hello.hs ~~
--                                                      ~~ (c) SRW, 04 Sep 2011

import System.Environment

main :: IO()
main = do
    argv <- getArgs
    putStrLn "Hello world!"

--  vim:set syntax=haskell:
