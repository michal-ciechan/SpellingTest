using Microsoft.AspNetCore.Mvc;

namespace Dragonair.Timer
{
    [ApiController]
    [Route("[controller]")]
    public class SessionHubController : ControllerBase
    {
        [Route("createSession")]
        public ActionResult<UserJoinedDto> CreateSession()
        {
            return NotFound();
        }
    }
}
