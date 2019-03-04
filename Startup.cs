using System;
using Youwell.Platform.Patient.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;

namespace Youwell.Platform.Patient
{
	public class Startup
	{
		ILogger _logger;

		public IHostingEnvironment HostingEnvironment { get; }
		public IConfiguration Configuration { get; }

		public Startup(IHostingEnvironment env, IConfiguration config, ILoggerFactory loggerFactory)
		{
			HostingEnvironment = env;
			Configuration = config;
			_logger = loggerFactory.CreateLogger<Startup>();
			_logger.LogInformation($"{DateTime.Now.ToString()}: Startup in environment: {env.EnvironmentName}");
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services)
		{
			var config = new ApplicationConfigurations();
			Configuration.GetSection("ApplicationConfigurations").Bind(config);
			services.AddSingleton(config);

			services.AddMvc();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
				{
					HotModuleReplacement = true,
					ReactHotModuleReplacement = true
				});
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
			}

			app.UseStaticFiles();

			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller=Home}/{action=Index}/{id?}");
			});

			app.UseMvc(routes =>
			{
				routes.MapSpaFallbackRoute(
					name: "spa-fallback",
					defaults: new { controller = "Home", action = "Index" });
			});
		}
	}
}
