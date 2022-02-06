import { eUser } from './test.entity';

describe('test entity construction', () => {

  it('normal', () => {
    const u = eUser.of({
      email: 'my@gmail.com',
      valid: true,
      lastName: ["a", ],
      age: 15,
    });

    expect(u.uid).not.toBeNull();
    expect(u.email).not.toBeNull();
    expect(u.createdAt).not.toBeNull();
    expect(u.updatedAt).not.toBeNull();
    expect(u.deletedAt).not.toBeNull();
    expect(u.PK).toEqual(u.uid);
    expect(u.SK).toEqual(u.createdAt);
  });

  // it("error if the entity doesn't extend the SuperBaseEntity", () => {
  //   expect(() => {
  //     @SuperEntity()
  //     class testNoExtend {
  //       @SuperUidAttribute()
  //       uid!: string;

  //       @SuperAttribute()
  //       email!: string;
  //     }
  //   }).toThrowError(Error);
  // });

  // it('error2', () => {
  //   expect(() => {
  //     @SuperEntity()
  //     class testNoPrimaryIndex extends SuperBaseEntity {
  //       @SuperDesperatedAttribute()
  //       uid!: string;

  //       @SuperAttribute()
  //       email!: string;
  //     }
  //   }).toThrowError(IndexDefinitionError);
  // });

  // it('error3', () => {
  //   expect(() => {
  //     @SuperEntity()
  //     class testNoSkippedGSI extends SuperBaseEntity {
  //       @PrimaryPartitionKey()
  //       @SuperUidAttribute()
  //       uid!: string;

  //       @GSIPartitionKey(1, 3)
  //       @SuperAttribute()
  //       email!: string;
  //     }
  //   }).toThrowError(IndexDefinitionError);
  // });
});
