--  Haskell source code

--  blastoff.hs ~~
--                                                      ~~ (c) SRW, 04 Sep 2011

import System.Environment

main :: IO()
main = do
    argv <- getArgs
    putStrLn (countdown 10)
        where
            countdown :: Int -> String
            countdown 0 = "Blastoff!"
            countdown n = if n > 0
                            then (show n ++ " ... " ++ countdown (n - 1))
                            else (countdown 0)

--  vim:set syntax=haskell:
