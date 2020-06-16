import Vue, {VueConstructor} from 'vue'
import {withKnobs, object} from '@storybook/addon-knobs'
import * as uiv from 'uiv'

import {RundeckVcr, Cassette} from 'ts-rundeck/dist/util/RundeckVcr'

Vue.use(uiv)

import LogViewer from './logViewer.vue'

import { EnrichedExecutionOutput, ExecutionLog } from '../../utilities/ExecutionLogConsumer'
import { Rundeck, TokenCredentialProvider } from 'ts-rundeck'
import {BrowserFetchHttpClient} from '@azure/ms-rest-js/es/lib/browserFetchHttpClient'

import fetchMock from 'fetch-mock'
import { RootStore } from '../../stores/RootStore'

// @ts-ignore
window._rundeck = {rundeckClient: new Rundeck(new TokenCredentialProvider('foo'), {baseUri: '/', httpClient: new BrowserFetchHttpClient()})}

export default {
    title: 'ExecutionViewer',
    decorators: [withKnobs]
}

function playback<T>(component: T, fixture: string): () => Promise<T> {
    return async () => {
        fetchMock.reset()
        const cassette = await Cassette.Load(fixture)
        const vcr = new RundeckVcr()
        vcr.play(cassette, fetchMock)
        return component
    }
}

export const darkTheme = () => (Vue.extend({
    components: { LogViewer },
    template: '<LogViewer :useUserSettings="false" :config="settings" executionId="1" style="height: 100%;" />',
    mounted: function() {
        const el = this.$el as any
        el.parentNode.style.height = '100%'
    },
    props: {
        settings: {
            default: {
                theme: 'dark'
            }
        }
    },
    provide: () => ({
        executionLogViewerFactory: function(){ 
            return Promise.resolve(new class {
                completed = false
                execCompleted = false
                size = 100
                async init(){ return Promise.resolve()}
                getEnrichedOutput() {
                    return {
                        id: '1',
                        offset: '50',
                        completed: false,
                        execCompleted: true,
                        hasFailedNodes: false,
                        execState: "completed",
                        lastModified: "foo",
                        execDuration: 100,
                        percentLoaded: 100,
                        totalSize: 100,
                        retryBackoff: 50000,
                        clusterExec: false,
                        compacted: false,
                        entries: []
                    }
                }
            })
        }
    })
}))

// export const loading = () => (Vue.extend({
//     components: { LogViewer },
//     template: '<LogViewer :useUserSettings="false" executionId="1" style="height: 100%;" />',
//     mounted: function() {
//         const el = this.$el as any
//         el.parentNode.style.height = '100%'
//     },
//     props: {},
//     provide: () => ({
//         executionLogViewerFactory: function(){ 
//             return Promise.resolve(new class {
//                 completed = false
//                 execCompleted = false
//                 size = 100
//                 async init(){ return Promise.resolve()}
//                 getEnrichedOutput() {
//                     return {
//                         id: '1',
//                         offset: '50',
//                         completed: false,
//                         execCompleted: true,
//                         hasFailedNodes: false,
//                         execState: "completed",
//                         lastModified: "foo",
//                         execDuration: 100,
//                         percentLoaded: 100,
//                         totalSize: 100,
//                         retryBackoff: 50000,
//                         clusterExec: false,
//                         compacted: false,
//                         entries: []
//                     }
//                 }
//             })
//         }
//     })
// }))

export const basicOutput = () => (Vue.extend({
    components: { 
        LogViewer: playback(LogViewer, '/fixtures/ExecBasicOutput.json')
    },
    template: '<LogViewer :useUserSettings="false" executionId="900" style="height: 100%;" />',
    mounted: async function() {
        const el = this.$el as any
        el.parentNode.style.height = '100%'
    },
    props: {
        
    },
    provide: () => ({
        rootStore: new RootStore(window._rundeck.rundeckClient),
        executionLogViewerFactory: function(){
            return Promise.resolve(new ExecutionLog('900'))
        }
    })
}))

export const htmlOutput = () => (Vue.extend({
    components: { 
        LogViewer: playback(LogViewer, '/fixtures/ExecHtmlOutput.json')
    },
    template: '<LogViewer :useUserSettings="false" executionId="907" style="height: 100%;" />',
    mounted: async function() {
        const el = this.$el as any
        el.parentNode.style.height = '100%'
    },
    props: {
        
    },
    provide: () => ({
        rootStore: new RootStore(window._rundeck.rundeckClient)
    })
}))

export const ansiColorOutput = () => (Vue.extend({
    components: { 
        LogViewer: playback(LogViewer, '/fixtures/ExecAnsiColorOutput.json')
    },
    template: '<LogViewer :useUserSettings="false" executionId="912" style="height: 100%;" />',
    mounted: async function() {
        const el = this.$el as any
        el.parentNode.style.height = '100%'
    },
    props: {
        
    },
    provide: () => ({
        rootStore: new RootStore(window._rundeck.rundeckClient)
    })
}))

export const largeOutput = () => (Vue.extend({
    components: { 
        LogViewer: playback(LogViewer, '/fixtures/ExecLargeOutput.json')
    },
    template: '<LogViewer :useUserSettings="false" executionId="7" style="height: 100%;" />',
    mounted: async function() {
        const el = this.$el as any
        el.parentNode.style.height = '100%'
    },
    props: {
        
    },
    provide: () => ({
        rootStore: new RootStore(window._rundeck.rundeckClient)
    })
}))

export const runningOutput = () => (Vue.extend({
    components: { 
        LogViewer: playback(LogViewer, '/fixtures/ExecRunningOutput.json')
    },
    template: '<LogViewer :useUserSettings="false" executionId="900" style="height: 100%;" />',
    mounted: async function() {
        const el = this.$el as any
        el.parentNode.style.height = '100%'
    },
    props: {
        
    },
    provide: () => ({
        rootStore: new RootStore(window._rundeck.rundeckClient)
    })
}))

// export const failedOutput = () => (Vue.extend({
//     components: { 
//         LogViewer: playback(LogViewer, '/fixtures/ExecFailedOutput.json')
//     },
//     template: '<LogViewer :useUserSettings="false" executionId="1" style="height: 100%;" />',
//     mounted: async function() {
//         const el = this.$el as any
//         el.parentNode.style.height = '100%'
//     },
//     props: {
        
//     },
//     provide: () => ({
//         executionLogViewerFactory: function(){
//             return Promise.resolve(new ExecutionLog('880'))
//         }
//     })
// }))


export const gutterOverflow = () => (Vue.extend({
    components: { 
        LogViewer: playback(LogViewer, '/fixtures/ExecBasicOutput.json')
    },
    template: '<LogViewer :useUserSettings="false" :config="config" executionId="900" style="height: 100%;" />',
    mounted: async function() {
        const el = this.$el as any
        el.parentNode.style.height = '100%'
    },
    props: {
        config: { default: {
            timestamps: true
        }}
    },
    provide: () => ({
        rootStore: new RootStore(window._rundeck.rundeckClient),
        executionLogViewerFactory: function(){
            return Promise.resolve(new ExecutionLog('900'))
        }
    })
}))