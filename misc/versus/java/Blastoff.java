//- Java source code

//- Blastoff.java ~~
//                                                      ~~ (c) SRW, 05 Sep 2011

public class Blastoff {
  private static String countdown(Integer t) {
    return (t == 0) ? "Blastoff!" : t.toString() + " ... " + countdown(t - 1);
  }
  public static void main(String[] argv) {
    System.out.println(countdown(10));
  }
}

//- vim:set syntax=java:
