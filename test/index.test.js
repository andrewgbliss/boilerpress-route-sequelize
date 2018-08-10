const { expect } = require('chai');
const Router = require('../index');

describe('boilerpress-routes-sequelize', () => {
  it('should test for default state', () => {
    try {
      Router();
    } catch (e) {
      expect(e.message).to.equal(
        'Require options, models and resources'
      );
    }
  });
  it('should test for models', () => {
    try {
      Router({});
    } catch (e) {
      expect(e.message).to.equal('Required models in options');
    }
  });
  it('should test for resources', () => {
    try {
      Router({ models: {} });
    } catch (e) {
      expect(e.message).to.equal('Required resources in options');
    }
  });
  it('should test for router', () => {
    const router = Router({ models: {}, resources: {} });
    expect(router).to.be.a('function');
  });
});
