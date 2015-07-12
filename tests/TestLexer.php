<?php

namespace TestLexer
{
  require_once "./src/lexer/TokenList.php";
  require_once "./src/lexer/Token.php";
  require_once "./src/lexer/Assertion.php";
  require_once "./src/lexer/Lexer.php";
  require_once "./src/lexer/Tokenizer.php";

  class TestLexer extends \PHPUnit_Framework_TestCase
  {
    protected $tokenStack = [];

    public function __construct()
    {
      $source = file_get_contents("./examples/Generic.capy");

      $lexer = new \CapyLexer\Tokenizer($source);
      $token = $lexer->nextToken();

      while ($token->getKey() != \CapyLexer\Lexer::T_EOF) {
        $this->tokenStack[] = $token;
        $token = $lexer->nextToken();
      }
    }

    public function testLength()
    {
      $this->assertEquals(155, sizeof($this->tokenStack));
    }

    public function testTokenOutput()
    {
      $this->expectf = explode("\n",
        file_get_contents("./tests/lexer_expect.phpt"));
      array_pop($this->expectf);

      $i = 0;
      while ($i < sizeof($this->expectf)) {
        $this->assertEquals($this->expectf[$i] . "\n",
          (string) $this->tokenStack[$i]);
        $i++;
      }
    }
  }
}