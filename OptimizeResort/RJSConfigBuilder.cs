﻿using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Optimizer
{
	class RJSConfigBuilder
	{
		readonly Options options;
		readonly string[] extensionIncludes;
		const string amdPath = "durandal/amd";
		const string almondName = "almond-custom";

		public RJSConfigBuilder(Options options)
		{
			this.options = options;

			extensionIncludes = new[] { ".js", options.ViewExtension };
		}

		public RJSConfig Build()
		{
			var info = new RJSConfig
			{
				Config = IO.GetBaseConfiguration(options),
				BaseUrl = DetermineApplicationPath()
			};

			List<string> excludes = new List<string>(FixupPaths(info.BaseUrl, GetExcludes(info.BaseUrl)));
			var dirs = options.Excludes.Split(',');
			foreach (string dir in dirs)
			{
				excludes.AddRange(FixupPaths(info.BaseUrl, GetExcludes(info.BaseUrl, dir)));
				excludes.AddRange(FixupPaths(info.BaseUrl, GetExcludes(info.BaseUrl, "", string.Concat("main-",dir,".js"), SearchOption.TopDirectoryOnly)));
			}
				
			excludes.AddRange(FixupPaths(info.BaseUrl, GetExcludes(info.BaseUrl, "", "*.min.js", SearchOption.TopDirectoryOnly)));
			info.Excludes = excludes.ToArray();

			info.Includes = FixupPaths(info.BaseUrl, GetIncludes(info.BaseUrl)).Except(info.Excludes);

			info.BuildFilePath = Path.Combine(options.ApplicationSource, amdPath, this.options.Build);
			info.OptimizerPath = Path.Combine(options.ApplicationSource, amdPath, "r.js");
			info.AlmondPath = Path.Combine(options.ApplicationSource, amdPath, almondName + ".js");
			info.OutputPath = Path.Combine(options.ApplicationSource, this.options.Target.Replace(".js", ".min.js"));
			info.MainPath = Path.Combine(options.ApplicationSource, this.options.Target);

			BuildConfig(info);

			return info;
		}

		void BuildConfig(RJSConfig info)
		{
			var config = info.Config;

			if (options.Loader == Options.LoaderOptions.Almond)
			{
				options.Log("Configuring for deploy with almond (custom).");

				JSON.EnsureProperty(config, "name", amdPath + "/" + almondName);
				JSON.EnsureProperty(config, "mainConfigFile", info.MainPath);
				JSON.EnsureProperty(config, "wrap", true);

				var insertRequire = JSON.EnsureArray(config, "insertRequire");
				var moduleStart = Path.GetFileNameWithoutExtension(info.MainPath);
				if (insertRequire.Count < 1)
				{
					insertRequire.Add(moduleStart);
				}
			}
			else
			{
				options.Log("Configuring for deploy with require.");

				JSON.EnsureProperty(config, "name", "main");
			}

			JSON.EnsureProperty(config, "baseUrl", info.BaseUrl);
			JSON.EnsureProperty(config, "out", info.OutputPath);

			var include = JSON.EnsureArray(config, "include");
			if (include.Count < 1)
			{
				foreach (var item in info.Includes)
				{
					include.Add(item);
				}
			}
		}

		string DetermineApplicationPath()
		{
			var sourcePath = options.ApplicationSource;

			if (!string.IsNullOrEmpty(sourcePath))
			{
				if (!Path.IsPathRooted(sourcePath))
				{
					sourcePath = Path.Combine(Directory.GetCurrentDirectory(), sourcePath);
				}
			}
			else
			{
				var current = Directory.GetCurrentDirectory();
				sourcePath = new DirectoryInfo(current).Parent.Parent.FullName;
				//amd -> durandal -> App
			}

			options.ApplicationSource = sourcePath;
			return sourcePath;
		}

		IEnumerable<string> GetIncludes(string applicationSource)
		{
			return from fileName in Directory.EnumerateFiles(applicationSource, "*", SearchOption.AllDirectories)
				   let info = new FileInfo(fileName)
				   where ShouldIncludeFile(info)
				   select info.FullName;
		}

		public IEnumerable<string> GetExcludes(string applicationSource)
		{
			return GetExcludes(applicationSource, "durandal/amd");
		}

		public IEnumerable<string> GetExcludes(string applicationSource, string dir)
		{
			return GetExcludes(applicationSource, dir, "*");
		}
		public IEnumerable<string> GetExcludes(string applicationSource, string dir, string filePattern, SearchOption searchOption = SearchOption.AllDirectories)
		{
			var vendor = Path.Combine(applicationSource, dir);

			if (!Directory.Exists(vendor))
			{
				return new string[] { };
			}

			return from fileName in Directory.EnumerateFiles(vendor, filePattern, searchOption)
				   select fileName;
		}

		bool ShouldIncludeFile(FileInfo info)
		{
			var extension = Path.GetExtension(info.FullName);
			return extensionIncludes.Contains(extension);
		}

		IEnumerable<string> FixupPaths(string applicationPath, IEnumerable<string> paths)
		{
			var rootMarker = applicationPath + "\\";
			var rootMarkerLength = rootMarker.Length;

			foreach (var path in paths)
			{
				var relativePath = path;
				var index = relativePath.LastIndexOf(rootMarker);

				if (index != -1)
				{
					relativePath = relativePath.Substring(index + rootMarkerLength);
				}

				relativePath = relativePath.Replace("\\", "/");

				if (relativePath.EndsWith(options.ViewExtension))
				{
					yield return options.ViewPlugin + "!" + relativePath;
				}
				else
				{
					relativePath = relativePath.Replace(".js", string.Empty);
					yield return relativePath;
				}
			}
		}
	}
}