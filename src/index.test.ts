/**
 * @file **this-module** | Tests for index.ts.
 * @author Ian Sanders
 * @copyright 2019 Ian Sanders
 * @license MIT
 */

import * as assert from "assert";
import {ImprovedRecord, required} from "./index";

interface Shape {
  a: number;
  b?: number;
  c?: number | undefined;
  d: number | undefined;
}

const ShapeRecord = ImprovedRecord<Shape>({
  a: required,
  b: 45,
  c: 17,
  d: required
});

context("ImprovedRecord", function(): void {
  // Most of these tests are for types, so they don't have assertions

  describe("(type) factory creation", function(): void {
    it("should accept valid defaults", function(): void {
      ImprovedRecord<Shape>({
        a: required,
        b: 45,
        c: 17,
        d: required
      });
    });

    it("should require optional properties to have defaults", function(): void {
      ImprovedRecord<Shape>({
        a: required,
        // @ts-expect-error
        b: required,
        c: 17,
        d: required
      });
    });

    it("should require `required` for all non-optional properties", function(): void {
      // @ts-expect-error
      ImprovedRecord<Shape>({
        b: 45,
        c: 17,
        d: required
      });

      ImprovedRecord<Shape>({
        a: required,
        b: 45,
        c: 17,
        // @ts-expect-error
        d: 12
      });
    });

    it("should never allow `undefined` as a default", function(): void {
      ImprovedRecord<Shape>({
        a: required,
        b: 45,
        // @ts-expect-error
        c: undefined,
        d: required
      });
    });
  });

  describe("instance creation / access", function(): void {
    it("should accept valid input", function(): void {
      const sample = ShapeRecord({
        a: 1,
        b: 6,
        c: 3,
        d: 2
      });

      assert.strictEqual(sample.a, 1);
      assert.strictEqual(sample.b, 6);
      assert.strictEqual(sample.c, 3);
      assert.strictEqual(sample.d, 2);
    });

    it("should allow optional values to be excluded", function(): void {
      const sample = ShapeRecord({
        a: 1,
        d: 2
      });

      assert.strictEqual(sample.a, 1);
      assert.strictEqual(sample.b, 45);
      assert.strictEqual(sample.c, 17);
      assert.strictEqual(sample.d, 2);
    });

    it("(type) should require required values to be specified", function(): void {
      // @ts-expect-error
      ShapeRecord({
        b: 6,
        c: 3,
        d: 2
      });
    });

    it("(type) should prevent values from being initialized to incorrect type", function(): void {
      ShapeRecord({
        a: 1,
        b: 6,
        // @ts-expect-error
        c: "hello",
        d: 2
      });
    });

    it("should accept `undefined` for optional properties", function(): void {
      const sample = ShapeRecord({
        a: 1,
        b: undefined,
        c: undefined,
        d: 2
      });

      assert.strictEqual(sample.a, 1);
      assert.strictEqual(sample.b, 45);
      assert.strictEqual(sample.c, 17);
      assert.strictEqual(sample.d, 2);
    });

    it("should allow explicit `undefined`", function(): void {
      const sample = ShapeRecord({
        a: 1,
        b: 2,
        c: 2,
        d: undefined
      });

      assert.strictEqual(sample.a, 1);
      assert.strictEqual(sample.b, 2);
      assert.strictEqual(sample.c, 2);
      assert.strictEqual(sample.d, undefined);
    });

    it("should remove optionality from values with defaults", function(): void {
      const sample = ShapeRecord({
        a: 1,
        b: 6,
        c: 3,
        d: 2
      });

      const a: number = sample.a;
      const b: number = sample.b;
      const c: number = sample.c;
      const d: number | undefined = sample.d;
      a;
      b;
      c;
      d;
    });

    it("(type) should disallow deleting required values", function(): void {
      const sample = ShapeRecord({
        a: 1,
        b: 6,
        c: 3,
        d: 2
      });

      // @ts-expect-error
      sample.remove("a");
      sample.remove("b");
      sample.remove("c");
      // @ts-expect-error
      sample.remove("d");

      // @ts-expect-error
      sample.delete("a");
      sample.delete("b");
      sample.delete("c");
      // @ts-expect-error
      sample.delete("d");
    });
  });
});
