package pgxp.horus.service;

import pgxp.horus.entity.Foto;
import java.util.UUID;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import javax.transaction.Transactional;
import javax.websocket.server.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import static javax.ws.rs.core.MediaType.MULTIPART_FORM_DATA;
import javax.ws.rs.core.Response;
import org.demoiselle.jee.core.api.crud.Result;
import org.demoiselle.jee.crud.AbstractREST;
import org.demoiselle.jee.crud.Search;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import pgxp.horus.bc.FotoBC;

@Api("v1/Fotos")
@ApiImplicitParams({
    @ApiImplicitParam(name = "Authorization", value = "JWT token",
            required = true, dataType = "string", paramType = "header")
})
@Path("v1/fotos")
public class FotoREST extends AbstractREST< Foto, UUID> {

    @GET
    @Override
    @Transactional
    @Search(fields = {"*"}) // Escolha quais campos vão para o frontend Ex: {"id", "description"}
    public Result find() {
        return bc.find();
    }

    /**
     *
     * @param input
     * @return
     */
    @POST
    @Path("upload")
    @Transactional
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response salvarAnexo(MultipartFormDataInput input) {
        ((FotoBC) bc).salvarAnexo(input);
        return Response.ok().build();
    }

    /**
     *
     * @param id
     * @return
     */
    @GET
    @Path("download/{id}")
    @Transactional
    @Produces("application/force-download")
    public Response download(@PathParam("id") Long id) {
        return Response.ok().build();
//        final ByteArrayInputStream in = new ByteArrayInputStream(anexo.getArquivo());
//        return Response.ok(in, MediaType.APPLICATION_OCTET_STREAM)
//            .header("content-disposition", "attachment; filename = '" + anexo.getNomeArquivo() + "'").build();
    }
}
