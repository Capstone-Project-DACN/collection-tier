const BATCH_SIZE = {
    MEAN: 30,
    STD_DEV: 15,
    MIN: 1,
    MAX: 70,
    MEAN1: 32,
    NUM_MODES: 3,
    LAMBDA: 0.05
}
const DISTRIBUTIONS = {
    BELL_CURVE: 'Bell Curve',
    UNIFORM: 'Uniform',
    LINEAR: 'Linear',
    BIMODAL: 'Bimodal',
    MULTIMODAL: 'Multimodal',
    EXPONENTIAL: 'Exponential'
}
const RANDOM_ORDER = false

module.exports = {
    BATCH_SIZE,
    DISTRIBUTIONS,
    RANDOM_ORDER
}