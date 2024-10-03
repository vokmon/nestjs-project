import { Actions } from '@src/decorators/actions.decorator';

describe('Action Guard Decorator', () => {
  it('should set metadata on a class', () => {
    @Actions(['read', 'write'])
    class TestClass {}

    const actions = Reflect.getMetadata(Actions.KEY, TestClass);
    expect(actions).toEqual(['read', 'write']);
  });

  it('should set metadata on a method', () => {
    class TestClass {
      @Actions(['update', 'delete'])
      testMethod() {}
    }

    const actions = Reflect.getMetadata(
      Actions.KEY,
      TestClass.prototype.testMethod,
    );
    expect(actions).toEqual(['update', 'delete']);
  });

  it('should return undefined if no metadata is set', () => {
    class TestClass {
      testMethod() {}
    }

    const actions = Reflect.getMetadata(
      Actions.KEY,
      TestClass.prototype.testMethod,
    );
    expect(actions).toBeUndefined();
  });

  it('should allow empty array as input', () => {
    @Actions([])
    class TestClass {}

    const actions = Reflect.getMetadata(Actions.KEY, TestClass);
    expect(actions).toEqual([]);
  });

  it('should not overwrite metadata when decorator is used multiple times', () => {
    @Actions(['read'])
    @Actions(['write'])
    class TestClass {}

    const actions = Reflect.getMetadata(Actions.KEY, TestClass);
    expect(actions).toEqual(['read']);
  });
});
