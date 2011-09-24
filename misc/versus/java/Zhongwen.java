//- Java source code

//- Zhongwen.java ~~
//                                                      ~~ (c) SRW, 05 Sep 2011

import java.io.PrintStream;
import java.io.UnsupportedEncodingException;

public class Zhongwen {
  public static void main(String[] argv) throws UnsupportedEncodingException {
    int[] message = {20320, 22909, 21527, 63};
    String decoded = new String(message, 0, message.length);
    (new PrintStream(System.out, true, "UTF-8")).println(decoded);
  }
}

//- vim:set syntax=java:
