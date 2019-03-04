using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;

namespace Youwell.Platform.Patient.Controllers
{
	public class HomeController : Controller
	{

		public IActionResult Index()
		{
			return View();
		}

		public IActionResult Error()
		{

			ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;

			return View();
		}
	}
}
