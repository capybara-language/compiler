<?php

namespace CapyLexer
{
  class Assertion
  {
    static function assertAlpha($char)
    {
      return ctype_alpha($char);
    }

    static function assertAlphaNum($char)
    {
      return ctype_alnum($char);
    }

    static function assertUnderscore($char)
    {
      return $char === "_";
    }

    static function assertNewline($char)
    {
      return $char === "\r\n" || $char === "\r" || $char === "\n";
    }

    static function assertNum($char)
    {
      return ctype_digit($char);
    }
  }
}