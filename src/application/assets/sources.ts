import { resource } from '../utils/resources';

export const sources: resource[] = [
    {
        name: "environmentMap",
        type: "cubeTexture",
        path: [
            '/assets/textures/environmentMaps/0/px.jpg',
            '/assets/textures/environmentMaps/0/nx.jpg',
            '/assets/textures/environmentMaps/0/py.jpg',
            '/assets/textures/environmentMaps/0/ny.jpg',
            '/assets/textures/environmentMaps/0/pz.jpg',
            '/assets/textures/environmentMaps/0/nz.jpg',
        ] 
    },
    {
        name:'floorColor',
        type:'texture',
        path: '/assets/textures/dirt/color.jpg'
    },
    {
        name: 'floorNormal',
        type: 'texture',
        path: '/assets/textures/dirt/normal.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltf',
        path: 'assets/models/Fox/glTF-Binary/Fox.glb'
    }
]