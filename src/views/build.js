#! /usr/bin/env node

const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename, dirname } = require('path')
const nunjucks = require('nunjucks')
const chokidar = require('chokidar')
const glob = require('glob')
const mkdirp = require('mkdirp')
const chalk = require('chalk').default
const del = require('del')

const { argv } = require('yargs')
    .usage('Usage: nunjucks <file|glob> [context] [options]')
    .example('nunjucks foo.tpl data.json', 'Compile foo.tpl to foo.html')
    .example('nunjucks *.tpl -w -p src -o dist', 'Watch .tpl files in ./src, compile them to ./dist')
    .demandCommand(1, 'You must provide at least a file/glob path')
    .epilogue('For more information on Nunjucks: https://mozilla.github.io/nunjucks/')
    .help()
    .alias('help', 'h')
    .locale('en')
    .version('1.0.0')
    .option('path', {
        alias: 'p',
        string: true,
        requiresArg: true,
        nargs: 1,
        describe: 'Path where templates live',
    })
    .option('out', {
        alias: 'o',
        string: true,
        requiresArg: true,
        nargs: 1,
        describe: 'Output folder',
    })
    .option('watch', {
        alias: 'w',
        boolean: true,
        describe: 'Watch files change, except files starting by "_"',
    })
    .option('extension', {
        alias: 'e',
        string: true,
        requiresArg: true,
        default: 'html',
        describe: 'Extension of the rendered files',
    })
    .option('options', {
        alias: 'O',
        string: true,
        requiresArg: true,
        nargs: 1,
        describe: 'Nunjucks options file',
    })

const inputDir = resolve(process.cwd(), argv.path) || ''
const outputDir = argv.out || ''

const context = argv._[1] ? JSON.parse(readFileSync(argv._[1], 'utf8')) : {}
// Expose environment variables to render context
context.env = process.env

/** @type {nunjucks.ConfigureOptions} */
const nunjucksOptions = argv.options
    ? JSON.parse(readFileSync(argv.options, 'utf8'))
    : { trimBlocks: true, lstripBlocks: true, noCache: true }

const nunjucksEnv = nunjucks.configure(inputDir, nunjucksOptions)

const render = (/** @type {string[]} */ files) => {
    for (const file of files) {
        // No performance benefits in async rendering
        // https://mozilla.github.io/nunjucks/api.html#asynchronous-support
        const res = nunjucksEnv.render(file, context)

        let outputFile = file.replace(/\.\w+$/, `.${argv.extension}`)

        if (outputDir) {
            outputFile = resolve(outputDir, outputFile)
            mkdirp.sync(dirname(outputFile))
        }

        console.log(chalk.blue('Rendering: ' + file))
        writeFileSync(outputFile, res)
    }
}

const getFactoryProps = (/** @type {string} */ file) => {
    var props = file.replace(/\[|\]/g, '').split('.');
    return { list: props[0], key: props[1] };
}

const produce = (/** @type {string[]} */ files) => {
    for (const file of files) {
        // No performance benefits in async rendering
        // https://mozilla.github.io/nunjucks/api.html#asynchronous-support
        const props = getFactoryProps(file);

        var outDir = dirname(file)
        if (outputDir) {
            outDir = resolve(outputDir, props.list, outDir);
            mkdirp.sync(outDir)
        }
        var outputFile, res
        for (const item of context[props.list]) {
            context.current_item = item;
            res = nunjucksEnv.render(file, context)

            console.log(chalk.blue('Rendering: ' + file + ' {' + item[props.key] + '}'))
            outputFile = resolve(outDir, `${item[props.key]}.${argv.extension}`)
            writeFileSync(outputFile, res)
        }
        delete context.current_item
    }
}

/** @type {glob.IOptions} */
const globOptions = { strict: true, cwd: inputDir, ignore: '**/_*.*', nonull: true }

const start = async function () {
    await del([resolve(outputDir, `**/*.${argv.extension}`)]);

    // Render the files given a glob pattern (except the ones starting with "_")
    glob(argv._[0], globOptions, (err, files) => {
        if (err) return console.error(chalk.red(err))
        const templates = files.filter((f) => basename(f).indexOf('[') === -1)
        const factories = files.filter((f) => basename(f).indexOf('[') === 0)
        render(templates)
        produce(factories)
    })

    // Watcher
    if (argv.watch) {
        const layouts = []
        const templates = []
        const factories = []

        /** @type {chokidar.WatchOptions} */
        const watchOptions = { persistent: true, cwd: inputDir }
        const watcher = chokidar.watch(argv._[0], watchOptions)

        watcher.on('ready', () => console.log(chalk.gray('Watching templates...')))

        // Sort files to not render partials/layouts
        watcher.on('add', (file) => {
            if (basename(file).indexOf('_') === 0) layouts.push(file)
            else if (basename(file).indexOf('[') === 0) factories.push(file)
            else templates.push(file)
        })

        // if the file is a layout/partial, render all other files instead
        watcher.on('change', (file) => {
            if (layouts.indexOf(file) > -1) {
                render(templates)
                produce(factories)
            } else if (factories.indexOf(file) > -1) produce([file])
            else render([file])
        })
    }
}
start();