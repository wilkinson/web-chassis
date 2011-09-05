--  Haskell source code

--  zhongwen.hs ~~
--                                                      ~~ (c) SRW, 04 Sep 2011

import Data.Char
import System.Environment

main :: IO()
main = do
    argv <- getArgs
    putStrLn decoded
        where
            message = [20320, 22909, 21527, 63]
            decoded = map chr message

--  vim:set syntax=haskell:
