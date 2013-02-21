## Optimizing on .NET  
### Resort based SPA's

Application optimization via Durandal's optimizer.exe works exactly as you'd expect.
However, the basic premises is one of a single SPA application, with main.js file in the root application folder

*OptimizerResort* takes the notion of a asp.net MVC project having multiple / segmented SPA's, each having a dedicated folder
below the /App root.
### Output name by convention
Targeting (-t) the main.js file will produce main.min.js

## Additional command line options
### -b -build 
Represents the r.js configuration file to create
### -t --target 
Represents the "main-somename.js" file to use, and will output main-somename.min.js
### -x --excluedDirs  
Directories to exclude from optimization

### Usage Example:
```` 
optimizerResort.exe -m generate -b myapp.build.js -t main-somename.js -x dirName1,dirName2,dirName3
````


