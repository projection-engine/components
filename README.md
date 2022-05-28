## Component list

- accordion
> Template wrapper for the accordion component (fabric-ui)

- color
> Color picker component 
 
- frame
> Custom window frame for electron
 
- loader
> Event based loader modal
 
- preview
> Template for image with icon fallback

- range
> Draggable numeric input
 
- resizable
> Divider that resizes next and previous siblings
 
- search
> Minimal search input
 
- selectbox
> Simple draggable select box

- selector
> Wrapper for selecting items with preview

- tabs
> TabRouter component for editor, with support for customizable option header per page
 
- tree
> Tree view component with drag/drop support

- viewport
> Editor viewport for editor


## Viewport workflow

#### useGPU

Since there is a limit for the quantity of webGL contexts and creating multiple buffers and textures are a bad idea
this hook will create a single instance of a context and the renderer and share it via the `GPUContextProvider`.

#### GPUContextProvider

Provider for gpu and renderer.