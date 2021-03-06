package pgxp.horus.service;


import io.swagger.annotations.Api;
import pgxp.horus.dao.UserDAO;
import pgxp.horus.security.Credentials;
import pgxp.horus.security.Social;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.ok;
import org.demoiselle.jee.security.annotation.Authenticated;


@Api("Auth")
@Path("auth")
@Produces(APPLICATION_JSON)
@Consumes(APPLICATION_JSON)
public class AuthREST {

    @Inject
    private UserDAO dao;

    @POST
    @Transactional
    public Response login(Credentials credentials) {
        return ok().entity(dao.login(credentials).toString()).build();
    }

    @GET
    @Transactional
    @Authenticated
    public Response retoken() {
        return ok().entity(dao.retoken().toString()).build();
    }

    @POST
    @Transactional
    @Path("register")
    public void register(Credentials credentials) {
        dao.register(credentials);
    }

    @POST
    @Transactional
    @Path("amnesia")
    public void amnesia(Credentials credentials) {
        dao.amnesia(credentials);
    }
    
    @POST
    @Transactional
    @Path("social")
    public Response social(Social social) {
        return ok().entity(dao.social(social).toString()).build();
    }

    @POST
    @Transactional
    @Path("fingerprint")
    public Response fingerprint(String fingerprint) {
        dao.setFingerprint(fingerprint);
        return ok().entity("").build();
    }
}
