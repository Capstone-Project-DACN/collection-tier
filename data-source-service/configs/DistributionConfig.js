const DISTRIBUTIONS = {
    BELL_CURVE: 'Bell Curve',
    UNIFORM: 'Uniform',
    LINEAR: 'Linear',
    BIMODAL: 'Bimodal',
    MULTIMODAL: 'Multimodal',
    EXPONENTIAL: 'Exponential'
}

const DISTRIBUTIONS_CONFIG = {
    [DISTRIBUTIONS.BELL_CURVE]: {
        MEAN: 30,
        STD_DEV: 15,
        MIN: 1,
        MAX: 70,
    },
    [DISTRIBUTIONS.UNIFORM]: {
        MIN: 1,
        MAX: 70
    },
    [DISTRIBUTIONS.LINEAR]: {
        MIN: 1,
        MAX: 70
    },
    [DISTRIBUTIONS.BIMODAL]: {
        MEAN: 32,
        MEAN1: 30,
        STD_DEV: 15,
        MIN: 1,
        MAX: 70
    },
    [DISTRIBUTIONS.MULTIMODAL]: {
        MEAN: 32,
        STD_DEV: 15,
        MIN: 1,
        MAX: 70,
        NUM_MODES: 3
    },
    [DISTRIBUTIONS.EXPONENTIAL]: {
        MIN: 1,
        MAX: 70,
        LAMBDA: 0.05
    }
}

const RANDOM_ORDER = false

const TIME = {
    TOTAL_DURATION: 200,
    INTERVAL: 2,
}

TIME.TOTAL_SLOTS = TIME.TOTAL_DURATION / TIME.INTERVAL

module.exports = {
    DISTRIBUTIONS,
    DISTRIBUTIONS_CONFIG,
    RANDOM_ORDER,
    TIME
}