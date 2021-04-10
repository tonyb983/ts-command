import logger from "../../src/util/logging";
import { DefaultLogger } from "../../src/util/logging/DefaultLogger";

describe('Logging Tests', () => {
  it('default import should work', () => {
    logger.log("This is a log message.")
    logger.debug("This is a debug message.")
    logger.info("This is an info message.")
    logger.warn("This is a warn message.")
    logger.error("This is an error message.")
  })

  it('should work with categories', () => {
    const l1 = DefaultLogger.withCategory('App')
    expect(l1.category).toBe('App')
    l1.log("This is a log message.")
    l1.debug("This is a debug message.")
    l1.info("This is an info message.")
    l1.warn("This is a warn message.")
    l1.error("This is an error message.")

    const l2 = l1.extend('Child')
    expect(l2.category).toBe('App:Child')
    l2.log("This is a log message.")
    l2.debug("This is a debug message.")
    l2.info("This is an info message.")
    l2.warn("This is a warn message.")
    l2.error("This is an error message.")
  })
})
