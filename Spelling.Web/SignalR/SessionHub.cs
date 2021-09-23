using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Markup;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Dragonair.Timer
{
    public class SessionInfo
    {
        public long Id { get; set; }
        public string SignalRGroupName { get; set; }
        public SessionStateDo StateDo { get; set; }
    }

    public class SessionStateDo
    {
        public List<UserDto> Users { get; set; } = new();
        public long Id { get; set; }
    }

    public class UserDto
    {
        public string Id { get; set; }
    }

    public class UserJoinedDto
    {
        public SessionStateDo SessionInfo { get; set; }
        public UserDto User { get; set; }
    }

    public interface ISessionClient
    {
        Task UserJoined(UserJoinedDto dto);
    }

    public class SessionHub : Hub<ISessionClient>
    {
        private readonly ILogger<SessionHub> _logger;

        public SessionHub(ILogger<SessionHub> logger)
        {
            _logger = logger;
        }

        private static long _nextSessionId = 1;
        private static readonly ConcurrentDictionary<long, SessionInfo> _sessionIdToInfo = new();
        private static readonly ConcurrentDictionary<long, SemaphoreSlim> _sessionLocks = new();

        public async Task<SessionStateDo> CreateSession()
        {
            var sessionId = Interlocked.Increment(ref _nextSessionId);

            var groupName = sessionId.ToString();

            var user = new UserDto
            {
                Id = Context.ConnectionId,
            };

            var info = new SessionInfo
            {
                Id = sessionId,
                SignalRGroupName = groupName,
                StateDo = new SessionStateDo
                {
                    Id = sessionId,
                    Users =
                    {
                        user,
                    },
                },
            };

            if (!_sessionIdToInfo.TryAdd(sessionId, info))
                throw new ApplicationException("Could not add session. Duplicate ID");

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var userJoinedModel = new UserJoinedDto
            {
                SessionInfo = info.StateDo,
                User = user,
            };

            await Clients
                .OthersInGroup(info.SignalRGroupName)
                .UserJoined(userJoinedModel);

            if (_logger.IsEnabled(LogLevel.Debug))
            {
                _logger.LogDebug($"Created Session {sessionId} by User {user.Id}");
            }

            return info.StateDo;
        }

        public async Task<SessionStateDo> JoinSession(JoinSessionDto arg)
        {
            var sessionId = arg.SessionId;

            var sessionLock = _sessionLocks.GetOrAdd(sessionId, l => new SemaphoreSlim(1));

            await sessionLock.WaitAsync();

            try
            {
                if (!_sessionIdToInfo.TryGetValue(sessionId, out var session))
                    throw new ApplicationException($"Session '{sessionId}' does not exist");

                if (session.StateDo.Users.Any(x => x.Id == Context.ConnectionId))
                    return session.StateDo;

                var userDto = new UserDto
                {
                    Id = Context.ConnectionId,
                };

                session.StateDo.Users.Add( userDto);

                await Groups.AddToGroupAsync(Context.ConnectionId, session.SignalRGroupName);

                await Clients
                    .OthersInGroup(session.SignalRGroupName)
                    .UserJoined(new UserJoinedDto
                    {
                        User = userDto,
                        SessionInfo = session.StateDo,
                    });

                return session.StateDo;
            }
            finally
            {
                sessionLock.Release();
            }
        }
    }

    public class JoinSessionDto
    {
        public long SessionId { get; set; }
    }
}
