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
  }
}