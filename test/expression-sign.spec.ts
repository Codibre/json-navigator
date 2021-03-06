import { expect } from 'chai';
import { $, baseOp } from '../src';

interface Something {
  ab: string;
  cd: [
    {
      a: {
        c: number;
      };
      b: number;
    },
  ];
}

describe('$', () => {
  it('should return the value of the item in the path using fluent mode', () => {
    const something: Something = {
      ab: 'ab value',
      cd: [
        {
          a: {
            c: 7,
          },
          b: 1,
        },
      ],
    };
    const path = $<Something>().cd[0].a.c;

    const result: number = path(something);

    expect(result).to.be.eq(7);
  });

  it('should return fallback when it i informed and the path is not found', () => {
    const something: Something = {
      ab: 'ab value',
      cd: [] as any,
    };
    const path = $<Something>().cd[0].a.c;

    const result: number | 'error' = path(something, 'error');

    expect(result).to.be.eq('error');
  });

  it('should throw a TypeError when path does not exist and fallback is set to none', () => {
    const something: Something = {
      ab: 'ab value',
      cd: [] as any,
    };
    const path = $<Something>().cd[0].a.c;
    let thrownError!: TypeError;

    try {
      path(something);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).to.be.instanceOf(TypeError);
    expect(thrownError.message).to.be.eq(
      "Property doesn't exists or is undefined: cd.0",
    );
  });

  it('should return the value of the item in the path using array mode', () => {
    const something: Something = {
      ab: 'ab value',
      cd: [
        {
          a: {
            c: 7,
          },
          b: 1,
        },
      ],
    };
    function test<T>(f: (a: Something) => T) {
      return f(something);
    }

    const result: number = test($('cd', 0, 'a', 'c'));

    expect(result).to.be.eq(7);
  });

  it('should work using first operation with an array', () => {
    const something = [1, 3, 2];

    function test<T>(f: (a: number[]) => T) {
      return f(something);
    }

    const result = test($(baseOp.first));

    expect(result).to.be.eq(1);
  });

  it('should work using first operation with an iterable', () => {
    const something = new Set([1, 3, 2]);

    function test<T>(f: (a: typeof something, fallback: any) => T) {
      return f(something, null);
    }

    const result = test($(baseOp.first));

    expect(result).to.be.eq(1);
  });

  it('should throw an error when first is used with a non iterable object', () => {
    const something = [1, 3, 2];

    function test<T>(f: (a: number[], fallback: any) => T) {
      return f(something, null);
    }
    let thrownErr: any;

    try {
      test($(0, baseOp.first));
    } catch (err) {
      thrownErr = err;
    }

    expect(thrownErr).to.be.instanceOf(Error);
  });

  it('should work using last operation with an array', () => {
    const something = [1, 3, 2];

    function test<T>(f: (a: number[], fallback: any) => T) {
      return f(something, null);
    }

    const result = test($(baseOp.last));

    expect(result).to.be.eq(2);
  });

  it('should work using last operation with an iterable', () => {
    const something = new Set([1, 3, 2]);

    function test<T>(f: (a: typeof something, fallback: any) => T) {
      return f(something, null);
    }

    const result = test($(baseOp.last));

    expect(result).to.be.eq(2);
  });

  it('should throw an error when last is used with a non iterable object', () => {
    const something = [1, 3, 2];

    function test<T>(f: (a: number[], fallback: any) => T) {
      return f(something, null);
    }
    let thrownErr: any;

    try {
      test($(0, baseOp.last));
    } catch (err) {
      thrownErr = err;
    }

    expect(thrownErr).to.be.instanceOf(Error);
  });
});
